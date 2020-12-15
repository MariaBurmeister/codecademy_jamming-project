import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PlaylistStack from '../PlaylistStack/PlaylistStack'
import Spotify from '../../util/Spotify';
import './App.css';
  
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchResults: [],

      playlistID: '',
      playlistName: 'New Playlist',
      playlistTracks: [],

      savedPlaylists: []
    };

    this.getSavedPlaylists =
    this.getSavedPlaylists.bind(this);

    this.addTrack = 
    this.addTrack.bind(this);

    this.removeTrack =
    this.removeTrack.bind(this);

    this.updatePlaylistName =
    this.updatePlaylistName.bind(this);

    this.savePlaylist = 
    this.savePlaylist.bind(this);

    this.choosePlaylistFromStack = 
    this.choosePlaylistFromStack.bind(this);

    this.search =
    this.search.bind(this);
  }

  addTrack(newTrack) {
    if (this.state.playlistTracks.find(track => track.id === newTrack.id)) {
      return;
    }

    const tracks = 
    [...this.state.playlistTracks, newTrack];

    this.setState({playlistTracks: tracks});

    const filteredResults = 
    this.state.searchResults
    .filter(track => track.id !== newTrack.id);

    this.setState({searchResults: filteredResults});
  }

  removeTrack(trackToRemove) {
    const tracks = 
    this.state.playlistTracks
    .filter(track => track.id !== trackToRemove.id);

    this.setState({playlistTracks: tracks});

    this.search(this.state.searchTerm);
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }

  savePlaylist() {
    const trackURIs = 
    this.state.playlistTracks.map(track => track.uri);

    if (this.state.playlistID) {
      console.log('isEdit');
      Spotify.savePlaylistEdit(
        this.state.playlistID, 
        this.state.playlistName, 
        trackURIs);
    } else {
      console.log('isNew');
      console.log('playlistID' + this.state.playlistID);
      Spotify.saveNewPlaylistToAccount( 
        this.state.playlistName, 
        trackURIs);
    }
    this.setState({playlistName:'New Playlist'});
    this.setState({playlistTracks:[]});
    setTimeout(() => this.getSavedPlaylists(), 2000);
  }

  choosePlaylistFromStack(savedPlaylist) {

    this.setState({playlistName: savedPlaylist.name});
    this.setState({playlistTracks: savedPlaylist.tracks});
    this.setState({playlistID: savedPlaylist.id});

    const newStack = 
    this.state.savedPlaylists.filter((playlist) => playlist !== savedPlaylist);

    this.setState({savedPlaylists: newStack});
  }

  search(term) { 
    if(!term) {
      return;
    }

    Spotify.search(term).then((searchResults) => { 
      const filteredResults = searchResults.filter((track) => {
        return !this.state.playlistTracks
        .find(playlistTrack => track.id === playlistTrack.id);
      });
      this.setState({searchResults: filteredResults});
      this.setState({searchTerm: term});
    });
  }

  getSavedPlaylists() {
    Spotify.getUsersPlaylists().then((playlists) => {
      this.setState({savedPlaylists: playlists});
    });
    
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getUserAccessToken()});
    this.getSavedPlaylists();
  }

  render() {
  
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults 
              results={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist 
              name={this.state.playlistName} 
              tracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
          <PlaylistStack 
            playlists={this.state.savedPlaylists}
            onChoose={this.choosePlaylistFromStack}
            isEditable={true}
          />
        </div>
      </div>
    );

  }
}

export default App;
