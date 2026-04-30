if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("../service-worker.js")
		.then(() => console.log("Service Worker registrado"))
		.catch((err) => console.log("Erro no SW", err))
}

function mostrarMensagemOffline() {
	const mensagem = document.querySelector("#mensagem-offline")

	if (mensagem) {
		mensagem.classList.add("visivel")
	}
}

function esconderMensagemOffline() {
	const mensagem = document.querySelector("#mensagem-offline")

	if (mensagem) {
		mensagem.classList.remove("visivel")
	}
}

function mostrarMensagem(texto) {
	const mensagem = document.querySelector("#mensagem-offline")

	if (mensagem) {
		mensagem.textContent = texto
		mensagem.classList.add("visivel")
	}
}

function limparMensagem() {
	const mensagem = document.querySelector("#mensagem-offline")

	if (mensagem) {
		mensagem.textContent = "Sem conexão"
		mensagem.classList.remove("visivel")
	}
}

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

function fecharMenu() {
	const menu = document.querySelector("#nav-mobile")

	if (menu) {
		menu.classList.remove("aberto")
	}
}

function alternarMenu() {
	const menu = document.querySelector("#nav-mobile")

	if (menu) {
		menu.classList.toggle("aberto")
	}
}

document.addEventListener("click", (evento) => {
	const menu = document.querySelector("#nav-mobile")
	const botaoMenu = document.querySelector(".menu-trigger")

	if (!menu || !botaoMenu) {
		return
	}

	if (!menu.contains(evento.target) && !botaoMenu.contains(evento.target)) {
		fecharMenu()
	}
})

// Funcao de buscar por CEP
function mostrar(registrarLog = true) {
	cep = document.getElementById("cep").value
	const cepLimpo = cep.replace(/\D/g, "")
	url = `https://viacep.com.br/ws/${cepLimpo}/json/`

	limparMensagem()

	if (cepLimpo.length !== 8) {
		mostrarMensagem("CEP inválido")
		return
	}

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
		.then((dadosCep) => {
			if (dadosCep.erro) {
				mostrarMensagem("CEP não encontrado")
				return
			}

			limparMensagem()
			console.log("Oi, meu CEP e no fetch", dadosCep)
			document.getElementById("cidade").value = dadosCep.localidade || ""
			document.getElementById("bairro").value = dadosCep.bairro || ""
			document.getElementById("ddd").value = dadosCep.ddd || ""
			document.getElementById("estado").value = dadosCep.uf || ""
			M.updateTextFields()
		})
		.catch(() => {
			mostrarMensagemOffline()
		})

	console.log("Oi, meu CEP e fora", cep)
}

function limparCep() {
	document.getElementById("cep").value = ""
	document.getElementById("cidade").value = ""
	document.getElementById("bairro").value = ""
	document.getElementById("ddd").value = ""
	document.getElementById("estado").value = ""
	limparMensagem()
	M.updateTextFields()
}

// Funcao de buscar por rua
function mostrarRua(registrarLog = true) {
	uf = $("#lista-ufs").val()
	cidade = $("#lista-cidades").val()
	rua = $("#rua").val()
	const ruaPesquisada = rua

	url = `https://viacep.com.br/ws/${uf}/${cidade}/${rua}/json/`

	limparMensagem()

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
			limparMensagem()
			console.log("AQUI AS RUAS", ruas)

			if (!Array.isArray(ruas) || ruas.length === 0) {
				document.querySelector("#lista-ruas").innerHTML = '<li class="collection-item">Nenhuma rua encontrada.</li>'
				return
			}

			let listaRuas = ""

			for (let endereco of ruas) {
				const logradouro = endereco.logradouro || ruaPesquisada
				const complemento = endereco.complemento ? `<h6>${escapeHtml(endereco.complemento)}</h6>` : ""
				const bairro = endereco.bairro ? `<h6>${escapeHtml(endereco.bairro)}</h6>` : ""

				listaRuas += `
					<li class="collection-item avatar">
						<h6>${escapeHtml(endereco.cep)}</h6>
						<h6>${escapeHtml(logradouro)}</h6>
						${complemento}
						${bairro}
						<h6>${escapeHtml(endereco.localidade)}</h6>
						<h6>${escapeHtml(endereco.uf)}</h6>
						<h6>${escapeHtml(endereco.estado)}</h6>
					</li>
				`
			}

			document.querySelector("#lista-ruas").innerHTML = listaRuas
			confetti()
		})
		.catch(() => {
			mostrarMensagemOffline()
		})
}

function limparRua() {
	document.querySelector("#lista-ufs").value = ""
	document.querySelector("#lista-cidades").innerHTML = '<option value="" disabled selected>Escolha uma Cidade</option>'
	document.querySelector("#rua").value = ""
	document.querySelector("#lista-ruas").innerHTML = ""
	limparMensagem()
	M.updateTextFields()
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
			esconderMensagemOffline()
			console.log("com axios", ufs.data)

			for (let uf of ufs.data) {
				listaUfs += `<option value="${uf.sigla}">${uf.nome}</option>`
			}
			document.querySelector("#lista-ufs").innerHTML = listaUfs
		})
		.catch(() => {
			mostrarMensagemOffline()
		})
}

buscarUFs()

function buscarCidades(uf) {
	url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
	listaCidades = '<option value="" disabled selected>Escolha uma Cidade</option>'

	return $.get(url, (cidades) => {
		esconderMensagemOffline()
		for (let cidade of cidades) {
			listaCidades += `<option value="${cidade.nome}">${cidade.nome}</option>`
		}
		document.querySelector("#lista-cidades").innerHTML = listaCidades
	}).fail(() => {
		mostrarMensagemOffline()
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
