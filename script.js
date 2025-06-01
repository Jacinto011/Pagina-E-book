// Initialize animations
new WOW().init();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow');
        navbar.style.backgroundColor = 'rgba(255,255,255,0.95)';
    } else {
        navbar.classList.remove('shadow');
        navbar.style.backgroundColor = 'rgba(255,255,255,1)';
    }
});

// Animation for price box when it comes into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__pulse');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.price-box').forEach(box => {
    observer.observe(box);
});


let currentPage = 1;

const walletData = {
    mkesh: {
        number: "Pagamento Seguro: 821272085",
        image: "imagem/mkesh.jpg"
    },
    emola: {
        number: "Pagamento Seguro: 863444447",
        image: "imagem/emola3.png"
    },
    mpesa: {
        number: "Pagamento Seguro: 856627849",
        image: "imagem/m-pesa.jpg"
    }
};

function changePage(newPage) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.footer-buttons').forEach(f => f.style.display = 'none');

    document.getElementById(`page${newPage}`).style.display = 'block';
    document.getElementById(`footer${newPage}`).style.display = 'flex';

    currentPage = newPage;
}

function nextPage(pageNum) {
    if (pageNum === 1) {
        const form = document.getElementById('paymentForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
    }

    if (pageNum === 2) {
        if (!document.getElementById('purpose').value || !document.getElementById('delivery').value) {
            alert('Por favor, responda a todas as perguntas.');
            return;
        }
    }

    if (pageNum === 3) {
        const selectedWallet = document.querySelector('input[name="wallet"]:checked');
        if (!selectedWallet) {
            alert('Por favor, selecione uma carteira.');
            return;
        }

        const walletKey = selectedWallet.value;
        document.getElementById('walletNumber').innerText = walletData[walletKey].number;
        document.getElementById('walletImage').src = walletData[walletKey].image;
    }

    changePage(pageNum + 1);
}

function prevPage(pageNum) {
    changePage(pageNum - 1);
}

async function submitPayment() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true; // Desabilita o botão

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        purpose: document.getElementById('purpose').value,
        delivery: document.getElementById('delivery').value,
        wallet: document.querySelector('input[name="wallet"]:checked')?.value
    };

    console.log('Form data:', formData);

    const apiUrl = "https://script.google.com/macros/s/AKfycbxpTuR4nyAJMBb7OTIQk-PkPCRZhVulbJUwfo5RQ-_wwWdkVNYbHAOKBcCOpqyONV6mVg/exec";

    try {
        const urlEncodedData = new URLSearchParams(formData);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlEncodedData
        });

        if (!response.ok) throw new Error('Erro ao enviar dados.');

        const result = await response.json();

        // Fecha o modal
        bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();

        alert('Aguardando pela sua compra! Por favor complete o pagamento seguindo as instruções. Boa leitura!');

        // Resetar o formulário
        document.getElementById('paymentForm').reset();
        document.getElementById('purpose').value = '';
        document.getElementById('delivery').value = '';
        document.querySelectorAll('input[name="wallet"]').forEach(w => w.checked = false);

        changePage(1);
    } catch (error) {
        alert('Erro ao enviar dados. Tente novamente mais tarde.');
        console.error('Erro:', error);

        submitButton.disabled = false; // Reabilita o botão em caso de erro
    }
}


// NOVO: Chamar dados via GET e exibir no console
async function fetchPayments() {
    const apiUrl = "https://script.google.com/macros/s/AKfycbxpTuR4nyAJMBb7OTIQk-PkPCRZhVulbJUwfo5RQ-_wwWdkVNYbHAOKBcCOpqyONV6mVg/exec";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("Pagamentos recebidos:", data);
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Exemplo: Chamar os dados assim que a página carregar
document.addEventListener("DOMContentLoaded", fetchPayments);

// Abrir modal
document.querySelector('.cta-button')?.addEventListener('click', function (e) {
    e.preventDefault();
    new bootstrap.Modal(document.getElementById('paymentModal')).show();
    changePage(1);
});