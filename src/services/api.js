const API_URL = "https://localhost:7102/api";

export async function login(email, wachtwoord) {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            wachtwoord
        })
    });

    if (!response.ok) {
        throw new Error("Login mislukt");
    }

    return await response.json();
}

export async function getStudiesessies(token) {
    const response = await fetch(`${API_URL}/Studiesessie`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Kon studiesessies niet ophalen");
    }

    return await response.json();
}

export async function getStudieDoelen(token) {
    const response = await fetch(`${API_URL}/StudieDoel`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Kon studiedoelen niet ophalen");
    }

    return await response.json();
}

export async function getTotaleStudietijd(token) {
    const response = await fetch(
        `${API_URL}/Studiesessie/totale-studietijd`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Kon statistieken niet ophalen");
    }

    return await response.json();
}