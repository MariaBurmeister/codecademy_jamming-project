import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);


        this.addTrack = 
        this.addTrack.bind(this);

        this.removeTrack = 
        this.removeTrack.bind(this);
    }
    
    renderAction() {
        if (this.props.isRemoval) {
            return (
                <button 
                onClick={this.removeTrack}
                className="Track-action">
                    -
                </button>);
        }
        return (
            <button 
            onClick={this.addTrack} 
            className="Track-action">
                +
            </button>);
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    render() {
        const name = this.props.track.name;
        const artist = this.props.track.artist;
        const album = this.props.track.album;

        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{name}</h3>
                    <p>{artist} | {album}</p>
                </div>
                <div>{this.renderAction()}</div>
            </div>
        );
    }
}

export default Track;