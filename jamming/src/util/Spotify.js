let userAccessToken;
const appClientID = '<your spotify app client id here>';
const redirectURI = 'http://my-playlist-jammer.surge.sh';
const spotifyAPI = 'https://api.spotify.com/v1/';

const Spotify = {
    getUserAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        } 

        const URI = window.location.href;
        const tokenInURI = URI.match(/access_token=([^&]*)/);
        const expireInURI = URI.match(/expires_in=([^&]*)/);

        if(tokenInURI) {
            const expiresIn = Number(expireInURI[1]);
            userAccessToken = tokenInURI[1];

            window.setTimeout(() => userAccessToken = '', expiresIn*1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        }
        const accessURL = `https://accounts.spotify.com/authorize?client_id=${appClientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        window.location = accessURL;
    },

    async search(searchTerm) {
        
        const userAccessToken = this.getUserAccessToken();
        const headers = {Authorization: `Bearer ${userAccessToken}`};
        const endPoint = 'search?type=track';
        const queryParams = `&q=${searchTerm}`;
        const url = `${spotifyAPI}${endPoint}${queryParams}`;

 
        const searchResponse = await fetch(url, {headers: headers})
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
        return searchResponse;

    },

    saveNewPlaylistToAccount(playlistName, trackURIs) {
        if (!playlistName || !trackURIs.length) {
            return;
        }
        const userAccessToken = this.getUserAccessToken();
        const headers = {Authorization: `Bearer ${userAccessToken}`};

        const endPointUser = 'me';
        const urlGET = `${spotifyAPI}${endPointUser}`;
        
        let userID;
        let endPointPlaylists;
        
        return fetch(urlGET, {headers: headers})
        .then(response => {
            return response.json()
        })
        .then(jsonResponse => {

            userID = jsonResponse.id;
            endPointPlaylists = `users/${userID}/playlists`;
            const urlPOSTName = `${spotifyAPI}${endPointPlaylists}`;

            return fetch(urlPOSTName, 
                {
                    headers: headers, 
                    method: 'POST', 
                    body: JSON.stringify({name: playlistName})
                })
                .then(response=> response.json())
                .then(jsonResponse=> {
                    console.log(jsonResponse);
                    const playlistID = jsonResponse.id;
                    const endpointTracks = `/${playlistID}/tracks`;
                    const urlPOSTTracks = `${spotifyAPI}${endPointPlaylists}${endpointTracks}`;

                    return fetch(urlPOSTTracks, 
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({uris: trackURIs})
                        });
                });
        });
    }
}

export default Spotify;