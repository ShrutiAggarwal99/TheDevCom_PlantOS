import React, { Component } from 'react';
import Webcam from '../WebCam';
import './styles.css';

class Canvas extends Component {
    constructor() {
        super();
        this.webcam = null;
        this.state = {
            capturedImage: null,
            captured: false,
            uploading: false
        }
    }

    componentDidMount() {
        // initialize the camera
        this.canvasElement = document.createElement('canvas');
        this.webcam = new Webcam(
            document.getElementById('webcam'),
            this.canvasElement
        );
        this.webcam.setup().catch(() => {
            alert('Error getting access to your camera');
        });
    }

    componentDidUpdate(prevProps) {
        if (!this.props.offline && (prevProps.offline === true)) {
            // if its online
            this.batchUploads();
        }
    }

    render() {
        const imageDisplay = this.state.capturedImage ?
            <img src={this.state.capturedImage} alt="captured" width="350" />
            :
            <span />;

        const buttons = this.state.captured ?
            <div>
                <button className="deleteButton" onClick={this.discardImage} > Delete Photo </button>
                <button className="captureButton" onClick={this.uploadImage} > Upload Photo </button>
            </div> :
            <button className="captureButton" onClick={this.captureImage} > Take Picture </button>

        const uploading = this.state.uploading ?
            <div><p> Uploading Image, please wait ... </p></div>
            :
            <span />

        return (
            <div>
                {uploading}
                <video autoPlay playsInline muted id="webcam" width="100%" height="200" />
                <br />
                <div className="imageCanvas">
                    {imageDisplay}
                </div>
                {buttons}
            </div>
        )
    }
    captureImage = async () => {
        const capturedData = this.webcam.takeBase64Photo({ type: 'jpeg', quality: 0.8 });
        this.setState({
            captured: true,
            capturedImage: capturedData.base64
        });
    }

    discardImage = () => {
        this.setState({
            captured: false,
            capturedImage: null
        })
    }
    uploadImage = () => {
        if (this.props.offline) {
            const prefix = 'cloudy_pwa_';
            const rs = Math.random().toString(36).substr(2, 5);
            localStorage.setItem(`${prefix}${rs}`, this.state.capturedImage);
            alert('Image saved locally, it will be uploaded to your library once internet connection is detected');
            this.discardImage();
        } else {
            this.setState({ uploading: true });
            // axios.post(
            //     `https://api.cloudinary.com/v1_1/CLOUDINARY_CLOUD_NAME/image/upload`,
            //     {
            //         file: this.state.capturedImage,
            //         upload_preset: 'CLOUDINARY_CLOUD_PRESET'
            //     }
            // ).then((data) => this.checkUploadStatus(data)).catch((error) => {
            //     alert('Sorry, we encountered an error uploading your image');
            //     this.setState({ 'uploading': false });
            // });
            this.checkUploadStatus({ status: 200 });
        }
    }
    findLocalItems = (query) => {
        let i;
        let results = [];
        for (i in localStorage) {
            if (localStorage.hasOwnProperty(i)) {
                if (i.match(query) || (!query && typeof i === 'string')) {
                    const value = localStorage.getItem(i);
                    results.push({ key: i, val: value });
                }
            }
        }
        return results;
    }

    checkUploadStatus = (data) => {
        this.setState({ uploading: false });
        if (data.status === 200) {
            alert('Image Uploaded to Library');
            this.discardImage();
        } else {
            alert('Sorry, we encountered an error uploading your image');
        }
    }

    batchUploads = () => {
        // this is where all the images saved can be uploaded as batch uploads
        const images = this.findLocalItems(/^cloudy_pwa_/);
        let error = false;
        if (images.length > 0) {
            this.setState({ uploading: true });
            for (let i = 0; i < images.length; i++) {
                // upload
                // axios.post(
                //     `https://api.cloudinary.com/v1_1/CLOUDINARY_CLOUD_NAME/image/upload`,
                //     {
                //         file: images[i].val,
                //         upload_preset: 'CLOUDINARY_CLOUD_PRESET'
                //     }

                // ).then(
                //     (data) => this.checkUploadStatus(data)
                // ).catch((error) => {
                //     error = true;
                // })
                this.checkUploadStatus({ status: 200 });
            }
            this.setState({ 'uploading': false });
            if (!error) {
                alert("All saved images have been uploaded to your Library");
            }
        }
    }
}

export default Canvas;