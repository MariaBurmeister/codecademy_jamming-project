import React from 'react';
import Playlist from '../Playlist/Playlist';
import './PlaylistStack.css';

class PlaylistStack extends React.Component {


    render() {
        const playlists = this.props.playlists;
        return (

            <section className="Playlist-Stack">
                <h2>Your Playlists</h2>
                {playlists.map(playlist => {
                    return (
                        <Playlist 
                            key={playlist.id}
                            name={playlist.name}
                            playlist={playlist}
                            tracks= {[]}
                            isEditable={this.props.isEditable}
                            onChoose={this.props.onChoose}
                        />
                    );
                })
                }
            </section>
        );
    }
}

export default PlaylistStack;