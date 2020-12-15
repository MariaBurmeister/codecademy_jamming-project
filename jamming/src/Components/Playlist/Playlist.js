import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange =
        this.handleNameChange.bind(this);

        this.handlePlaylistChoose =
        this.handlePlaylistChoose.bind(this);

        this.renderAction =
        this.renderAction.bind(this);
    }

    renderAction() {
        if (this.props.isEditable) {
            return (
                <button 
                onClick={this.handlePlaylistChoose}
                className="Playlist-save">
                    EDIT PLAYLIST
                </button>);
        } 
        return (
            <button 
            onClick={this.props.onSave} 
            className="Playlist-save">
                SAVE TO SPOTIFY
            </button> );
    }
        
    handlePlaylistChoose(e) {
        this.props.onChoose(this.props.playlist)
    }

    handleNameChange(e) {
        if (this.props.isEditable) {
            return;
        }
        
        this.props.onNameChange(e.target.value);
    }

    render() {

        return (
            <div className="Playlist">
                <input 
                    value={this.props.name}
                    onChange={this.handleNameChange}/>
                {<TrackList 
                    tracks={this.props.tracks}
                    onRemove={this.props.onRemove}
                    isRemoval={true}
                 />}
                {this.renderAction()}
            </div>
        );
    }
}

export default Playlist;