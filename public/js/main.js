const clientId = "63e86a9b2b384bc3a680bab6d20e975b";
const clientSecret = "6f0c9ad58cef41e4b1555234d2943690";
const token =
  "BQDwkB8FHmhTudzxhMVAOdbUHAZOoJjk5bMBFi0PlUi4hrpmbsgvlKAYeTbjCasDqdah1NVMAo7SW3S9cmM";

// private methods
const getToken = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret)
    },
    body: "grant_type=client_credentials"
  });

  const data = await result.json();
  document.getElementById("tokenInput").value = data.access_token;
};

getToken();
