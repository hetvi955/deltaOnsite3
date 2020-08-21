const client_id = process.env.ClientID;
const client_secret = process.env.ClientSecret;

const newtoken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(client_id + ":" + client_secret)
        },
        body: "grant_type=client_credentials"
  });
const doc = await result.json();
    document.getElementById("tokenInput").value = doc.access_token;
};
newtoken();