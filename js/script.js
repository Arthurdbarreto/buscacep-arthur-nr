function obterLogs() {
	const logsSalvos = localStorage.getItem("logs")

	if (!logsSalvos) {
		return []
	}

	try {
		const logs = JSON.parse(logsSalvos)
		return Array.isArray(logs) ? logs : []
	} catch (error) {
		const valores = logsSalvos.split("|")

		if (valores[0] && valores[0].trim() === "CEP") {
			return [{
				tipo: "CEP",
				data: valores[1],
				cep: valores[2]
			}]
		}

		return []
	}
}

function salvarLog(log) {
	const logs = obterLogs()
	logs.unshift(log)
	localStorage.setItem("logs", JSON.stringify(logs))
}

function escapeHtml(valor) {
	return String(valor || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
}

// Funcao de buscar por CEP
function mostrar(registrarLog = true) {
	cep = document.getElementById("cep").value
	url = `https://viacep.com.br/ws/${cep}/json/`

	if (registrarLog) {
		salvarLog({
			tipo: "CEP",
			data: new Date().toLocaleDateString("pt-BR"),
			cep
		})
	}

	fetch(url)
		.then((res) => {
			return res.json()
		})
		.then((cep) => {
			console.log("Oi, meu CEP e no fetch", cep)
			document.getElementById("cidade").value = cep.localidade
			document.getElementById("bairro").value = cep.bairro
			document.getElementById("ddd").value = cep.ddd
			document.getElementById("estado").value = cep.uf
			M.updateTextFields()
		})

	console.log("Oi, meu CEP e fora", cep)
}

// Funcao de buscar por rua
function mostrarRua(registrarLog = true) {
	uf = $("#lista-ufs").val()
	cidade = $("#lista-cidades").val()
	rua = $("#rua").val()

	url = `https://viacep.com.br/ws/${uf}/${cidade}/${rua}/json/`

	if (registrarLog) {
		salvarLog({
			tipo: "RUA",
			data: new Date().toLocaleDateString("pt-BR"),
			uf,
			cidade,
			rua
		})
	}

	fetch(url)
		.then((res) => {
			return res.json()
		})
		.then((ruas) => {
			console.log("AQUI AS RUAS", ruas)

			let listaRuas = ""

			for (let rua of ruas) {
				dadosRua = ""
				const { ddd, ibge, regiao, siafi, ...ruaNova } = rua
				for (let prop in ruaNova) {
					dadosRua = dadosRua + `<h6>${ruaNova[prop]}</h6>`
				}
				listaRuas = listaRuas + `<li class="collection-item avatar">${dadosRua}</li>`
			}

			document.querySelector("#lista-ruas").innerHTML = listaRuas
			confetti()
		})
}

function buscarUFs() {
	const cepInput = document.getElementById("cep")

	IMask(cepInput, {
		mask: "00000-000"
	})

	url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
	listaUfs = '<option value="" disabled selected>Escolha uma UF</option>'

	axios.get(url)
		.then((ufs) => {
			console.log("com axios", ufs.data)

			for (let uf of ufs.data) {
				listaUfs += `<option value="${uf.sigla}">${uf.nome}</option>`
			}
			document.querySelector("#lista-ufs").innerHTML = listaUfs
		})
}

buscarUFs()

function buscarCidades(uf) {
	url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
	listaCidades = '<option value="" disabled selected>Escolha uma Cidade</option>'

	return $.get(url, (cidades) => {
		for (let cidade of cidades) {
			listaCidades += `<option value="${cidade.nome}">${cidade.nome}</option>`
		}
		document.querySelector("#lista-cidades").innerHTML = listaCidades
	})
}

async function buscarLog(indice) {
	const log = obterLogs()[indice]

	if (!log) {
		return
	}

	if (log.tipo === "CEP") {
		document.querySelector("#cep-tab-link a").click()
		document.querySelector("#cep").value = log.cep
		M.updateTextFields()

		setTimeout(() => {
			mostrar(false)
		}, 300)
	} else {
		document.querySelector("#rua-tab-link a").click()
		document.querySelector("#lista-ufs").value = log.uf
		await buscarCidades(log.uf)
		document.querySelector("#lista-cidades").value = log.cidade
		document.querySelector("#rua").value = log.rua
		M.updateTextFields()

		setTimeout(() => {
			mostrarRua(false)
		}, 300)
	}
}

function carregarLogs() {
	const logs = obterLogs()

	if (logs.length === 0) {
		document.querySelector("#lista-logs").innerHTML = '<li class="collection-item">Nenhuma busca no historico.</li>'
		return
	}

	listaLogs = logs.map((log, indice) => {
		const texto = log.tipo === "CEP"
			? `CEP | ${log.data} | ${log.cep}`
			: `RUA | ${log.data} | ${log.uf} - ${log.cidade} - ${log.rua}`

		return `
			<li class="collection-item">
				<div>
					${escapeHtml(texto)}
					<a href="#!" class="secondary-content" onclick="buscarLog(${indice})">
						<i class="material-icons">remove_red_eye</i>
					</a>
				</div>
			</li>
		`
	}).join("")

	document.querySelector("#lista-logs").innerHTML = listaLogs
}
