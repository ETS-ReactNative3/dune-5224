import React, {Component} from "react";
import { Image, Dimensions, Modal } from 'react-native';
import {Body, Card, CardItem, Thumbnail, Left, Spinner} from "native-base";
import {Text,} from "react-native-elements";
import {TouchableOpacity, StyleSheet} from "react-native";
import ImageViewer from 'react-native-image-zoom-viewer';


let ScreenWidth = Dimensions.get("window").width;

const images = [
    {
        // Simplest usage.
        url: "https://external-preview.redd.it/lN8SeTNkfDGfWG5ddhlQaCIG5482FDvqRWPWrNBvVQ0.jpg?width=640&crop=smart&auto=webp&s=0b567002f043caee4e537574d1bf6a7d5756edf2",
        freeHeight: true
    }
];

class PostCard extends Component {
    state = {
        url: null,
        height: null,
        loading: true,
        modal: false,
    }

    getImages = (images) => {
        let imageUrls = [];
        images.forEach((image) => {
            imageUrls.push({
                url: image.resolutions[image.resolutions.length-1].url.replace(/amp;/g, ''),
                props: {}
            })
        })
        return imageUrls;
    }

    getPreviewUrl = async (resolutions) => {
        let final_resolution;
        for (let i=resolutions.length-1; i >= 0; i--){
            if (resolutions[i].width < ScreenWidth){
                final_resolution = resolutions[i];
                break;
            }
        }
        let url = final_resolution.url.replace(/amp;/g, '');
        this.setState({
            url: url,
            height: final_resolution.height,
            loading: false
        })
    }

    _openImageViewer = () => {
        console.log('open')
        this.setState({
            modal: true
        })
    }

    _onSwipeDown = () => {
        this.setState({
            modal: false
        })
    }

    componentDidMount() {
        if(this.props.item.preview)
            this.getPreviewUrl(this.props.item.preview.images[0].resolutions)
    }

    render () {
        let item = this.props.item;
        return (
            <Card style={styles.card}>
                <CardItem header bordered>
                    <Text>{item.subreddit_name_prefixed}</Text>
                </CardItem>
                <CardItem bordered>
                    <Left>
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                        </Body>
                    </Left>
                </CardItem>
                {this.state.loading &&
                    <Spinner color='blue' />
                }
                {item.preview && !this.state.loading &&
                <CardItem cardBody>
                    <TouchableOpacity
                        style={{backgroundColor: 'transparent'}}
                        onPress={this._openImageViewer}
                    >
                        <Image
                            source={{uri: this.state.url}}
                            style={{
                                height: this.state.height,
                                width: ScreenWidth,
                                flex: 1,
                            }}
                        />
                        <Modal
                            visible={this.state.modal}
                            transparent={true}
                            onRequestClose={() => {
                                alert('Please login to continue.');
                            }}>
                            <ImageViewer
                                imageUrls={this.getImages(item.preview.images)}
                                onSwipeDown={this._onSwipeDown}
                                enableSwipeDown={true}
                                renderIndicator={() => null}
                            />
                        </Modal>
                    </TouchableOpacity>
                </CardItem>
                }
                <TouchableOpacity style={{backgroundColor: 'transparent'}}>
                    <CardItem footer bordered>
                        <Text>u/{item.author}</Text>
                    </CardItem>
                </TouchableOpacity>
            </Card>
        )
    }
}

export default PostCard;

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
    }
});