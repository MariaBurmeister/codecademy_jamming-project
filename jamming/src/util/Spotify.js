let userAccessToken;
const appClientID = '0a91deef6b544e8fb82641394626025f';
const redirectURI = 'http://localhost:3000/';
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

    async getUsersPlaylists() {
        const userAccessToken = this.getUserAccessToken();
        const headers = {Authorization: `Bearer ${userAccessToken}`};

        const endPointUser = 'me';
        const urlGETID = `${spotifyAPI}${endPointUser}`;
        
        let userID;
        let endPointPlaylists;
        
        const userIdUrlresponse = await fetch(urlGETID, {headers: headers})
        const jsonResponse = await userIdUrlresponse.json()
    
        userID = jsonResponse.id;
        endPointPlaylists = `users/${userID}/playlists`;
        const urlGETPlaylists = `${spotifyAPI}${endPointPlaylists}`;

        const playlistsUrlResponse = await fetch(urlGETPlaylists, {headers: headers})
        const playlistsJson = await playlistsUrlResponse.json();

        
        const playlists = [];
        
        for (const playlist of playlistsJson.items) {
            const endPointTracks = `playlists/${playlist.id}/tracks`;
            const urlGETTracks = `${spotifyAPI}${endPointTracks}`;

            const tracksResponse = await fetch(urlGETTracks, {headers:headers})
            const tracksJson = await tracksResponse.json()

            playlists.push({
                id: playlist.id,
                colaborative: playlist.colaborative,
                name: playlist.name,
                tracks: tracksJson.items.map(track => {
                    
                    return {
                    id: track.track.id,
                    name: track.track.name,
                    artist: track.track.artists[0].name,
                    album: track.track.album.name,
                    uri: track.track.uri
                }})
            });
        }

        return playlists;
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
        console.log('Entered Save New');
        console.log(`playlistName ${playlistName}, trackURIs ${trackURIs}`);

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
                    
                    const playlistID = jsonResponse.id;
                    const endpointTracks = `/${playlistID}/tracks`;
                    const urlPUTTracks = `${spotifyAPI}${endPointPlaylists}${endpointTracks}`;

                    return fetch(urlPUTTracks, 
                        {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({uris: trackURIs})
                        });
                });
        });
    },

    savePlaylistEdit( playlistID, playlistName, trackURIs) {
        console.log('Entered Save Edit');
        console.log(`playlistID ${playlistID}, playlistName ${playlistName}, trackURIs ${trackURIs}`);


        if (!playlistName || !trackURIs.length) {
            return;
        }

        const userAccessToken = this.getUserAccessToken();
        const headers = {
            Authorization: `Bearer ${userAccessToken}`,
            'Content-Type': 'application/json' 
        };
    
        const endPointPlaylists = `playlists/${playlistID}`;
        const urlPUTName = `${spotifyAPI}${endPointPlaylists}`;
    
        fetch(urlPUTName, {
                headers: headers, 
                method: 'PUT', 
                body: JSON.stringify({name: playlistName})
            });
                
        const endpointTracks = `/tracks`;
        const urlPUTTracks = `${spotifyAPI}${endPointPlaylists}${endpointTracks}`;

        fetch(urlPUTTracks, 
            {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({uris: trackURIs})
            });
    }
    
}


export default Spotify;