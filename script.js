
"use strict";

// MENU RESPONSIVO
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Fecha o menu após selecionar um link
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
            menuToggle.textContent = "☰";
        });
    });

    // Fecha o menu com a tecla Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
            menuToggle.textContent = "☰";
        }
    });
}

// ANO AUTOMÁTICO NO RODAPÉ
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* ========================================
   BELLA FESTA - LOGIN E CADASTRO
   Demonstração exclusivamente front-end
   ======================================== */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authTitle = document.getElementById("authTitle");
const authDescription = document.getElementById("authDescription");
const authMessage = document.getElementById("authMessage");

// Alterna entre login e cadastro
function showAuthForm(type) {
    if (!loginForm || !registerForm) return;

    const isLogin = type === "login";

    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    loginTab.setAttribute("aria-selected", String(isLogin));
    registerTab.setAttribute("aria-selected", String(!isLogin));

    loginTab.tabIndex = isLogin ? 0 : -1;
    registerTab.tabIndex = isLogin ? -1 : 0;

    authTitle.textContent = isLogin
        ? "Bem-vindo de volta!"
        : "Vamos nos conhecer?";

    authDescription.textContent = isLogin
        ? "Entre com seus dados para continuar."
        : "Preencha seus dados para fazer seu cadastro.";

    hideAuthMessage();
}

if (loginTab && registerTab) {
    loginTab.addEventListener("click", () => showAuthForm("login"));
    registerTab.addEventListener("click", () => showAuthForm("register"));
}

document.querySelectorAll("[data-show-form]").forEach((button) => {
    button.addEventListener("click", () => {
        showAuthForm(button.dataset.showForm);
    });
});

// Mostra ou esconde a senha
document.querySelectorAll("[data-password]").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.password);
        if (!input) return;

        const showPassword = input.type === "password";
        input.type = showPassword ? "text" : "password";

        button.setAttribute(
            "aria-label",
            showPassword ? "Ocultar senha" : "Mostrar senha"
        );

        button.textContent = showPassword ? "◎" : "◉";
    });
});

// Mensagens
function hideAuthMessage() {
    if (!authMessage) return;

    authMessage.hidden = true;
    authMessage.classList.remove("error");
    authMessage.replaceChildren();
}

function showAuthMessage(message, isError = false, link = null) {
    if (!authMessage) return;

    authMessage.replaceChildren();
    authMessage.append(document.createTextNode(message));
    authMessage.classList.toggle("error", isError);
    authMessage.hidden = false;

    if (link) {
        authMessage.append(document.createElement("br"));

        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.textContent = link.label;
        authMessage.append(anchor);
    }

    authMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// Login demonstrativo
if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        hideAuthMessage();

        if (!loginForm.reportValidity()) return;

        showAuthMessage(
            "Login demonstrativo validado! Nenhuma autenticação real foi realizada.",
            false,
            {
                href: "dashboard.html",
                label: "Conhecer o painel principal →"
            }
        );
    });
}

// Cadastro demonstrativo
if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        hideAuthMessage();

        if (!registerForm.reportValidity()) return;

        showAuthMessage(
            "Cadastro demonstrativo preenchido com sucesso! Os dados não foram salvos. Você já pode conhecer o painel.",
            false,
            {
                href: "dashboard.html",
                label: "Ir para o painel principal →"
            }
        );
    });
}

// Recuperação de senha demonstrativa
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", () => {
        hideAuthMessage();

        const email = document.getElementById("loginEmail");

        if (!email.value.trim()) {
            showAuthMessage(
                "Digite seu e-mail no campo acima para simular a recuperação de senha.",
                true
            );

            email.focus();
            return;
        }

        if (!email.checkValidity()) {
            email.reportValidity();
            return;
        }

        showAuthMessage(
            "Solicitação demonstrativa recebida. Nenhum e-mail foi enviado e nenhuma senha foi alterada."
        );
    });
}

// Máscara visual simples para telefone brasileiro
const registerPhone = document.getElementById("registerPhone");

if (registerPhone) {
    registerPhone.addEventListener("input", () => {
        let digits = registerPhone.value.replace(/\D/g, "").slice(0, 11);

        if (digits.length > 10) {
            digits = digits.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else if (digits.length > 6) {
            digits = digits.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                "($1) $2-$3"
            );
        } else if (digits.length > 2) {
            digits = digits.replace(
                /^(\d{2})(\d{0,5})/,
                "($1) $2"
            );
        } else if (digits.length > 0) {
            digits = digits.replace(/^(\d{0,2})/, "($1");
        }

        registerPhone.value = digits;
    });
}


/* ========================================
   BELLA FESTA - INTERAÇÕES DO DASHBOARD
   ======================================== */

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const dashboardToast = document.getElementById("dashboardToast");

// Data atual em português
const dashboardDate = document.getElementById("dashboardDate");

if (dashboardDate) {
    dashboardDate.textContent = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

// Menu lateral responsivo
function closeSidebar() {
    if (!sidebar || !sidebarToggle) return;

    sidebar.classList.remove("sidebar-open");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.setAttribute("aria-label", "Abrir menu");
    sidebarToggle.textContent = "☰";
}

if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("sidebar-open");

        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
        sidebarToggle.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );
        sidebarToggle.textContent = isOpen ? "✕" : "☰";
    });

    sidebar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // Fecha o menu se a janela voltar ao formato desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1050) {
            closeSidebar();
        }
    });
}

// Notificações demonstrativas
const notificationButton = document.getElementById("notificationButton");

if (notificationButton && dashboardToast) {
    notificationButton.addEventListener("click", () => {
        dashboardToast.textContent =
            "Você está no modo demonstração. Não existem notificações reais ou pedidos atualizados.";

        dashboardToast.hidden = false;
    });

    // Fecha a mensagem ao clicar nela
    dashboardToast.addEventListener("click", () => {
        dashboardToast.hidden = true;
    });
}

const notificationButtonTop = document.getElementById("notificationButtonTop");

if (notificationButtonTop && dashboardToast) {
    notificationButtonTop.addEventListener("click", () => {
        dashboardToast.textContent =
            "Você está no modo demonstração. Não existem notificações reais ou pedidos atualizados.";

        dashboardToast.hidden = false;
    });
}
