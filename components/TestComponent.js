import React from 'react';
import { Platform, 
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import axios from "axios";

class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      default: "true",
      message: "notChangedYet",
      url: null,
      spinner: false,
      formattedText: null
    }
    //bindings
    this.testPress = this.testPress.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.getSubtitles = this.getSubtitles.bind(this);

  }
  //functions

  testPress() {
    console.log("onPress activated");
    this.setState({ message: "Changed! "});
  }

  inputChange(text) {
    this.setState({ url: text });
  }

  async getSubtitles() {
    console.log("getting subtitles");
    //https://www.youtube.com/watch?v=FIORjGvT0kk&list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2s-V
    //https://www.youtube.com/watch?v=XJGiS83eQLk&t=0h3m57s
    // via regex (could also just slice)
    const vidId = this.state.url.match(/\/watch\?v=(\w+)&?/i)[1];
    const baseStr = "https://www.youtube.com/api/timedtext?lang=en&v=";
    const link = baseStr + vidId;
    this.setState({ spinner: true });
    console.log("link being queried", link);
    let xmlResponse = await axios.get(link);
    console.log("xmlResponse", xmlResponse);
    let serializer = new XMLSerializer();
    var formattedText = serializer.serializeToString(xmlResponse)
                                  .replace(/<text start="[\d\.]+" dur="[\d\.]+">[\s\n]+<\/text>/g, "")
                                  .replace(/\n{2,}/, "")
                                  .replace(/\n/g, "\r\n")
                                  .replace(/<\/text>/g, "\r\n")
                                  .replace(/<[^>]+>/g, "")
                                  .replace(/&amp;#39;/g, "'")
                                  .trim();
    this.setState({ formattedText, spinner: false });
  }

  render() {
    if (this.state.spinner) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      )
    } else if (this.state.formattedText) {
      return (
        <View>
          <Text>
            {this.state.formattedText}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.inputRow}>
            <TextInput 
              onChangeText={this.inputChange}
              placeholder="Video URL"
              placeholderTextColor="#333333"
              style={
                {
                  paddingLeft: 3, 
                  borderWidth: 1, 
                  borderRadius: 5, 
                  borderColor: "black",
                  width: "75%",
                  maxWidth: 300,
                  padding: 2,
                  paddingLeft: 4,
                  height: 40
                }
              }
            >
            </TextInput>
            <TouchableOpacity
              color="#ffedc7"
              onPress={this.getSubtitles}
              style={styles.getButton}
              activeOpacity={0.5}
            >
              <Text style={{fontSize: 16, color: "black"}}> Get Subtitles </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }
}

export default TestComponent;

const styles = StyleSheet.create({
  textView: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 400
  },
  container: {
    display: "flex",
    flexDirection: "column"
  },
  getButton: {
    backgroundColor: "#ffedc7",
    padding: 3,
    paddingTop: 6,
    marginLeft: 8,
    borderRadius: 10,
    height: 35
  }
});