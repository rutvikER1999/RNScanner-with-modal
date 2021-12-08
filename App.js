import React, { useRef, useState, useEffect } from "react";
import { TouchableOpacity, View, Button, Text, ActivityIndicator, Dimensions, Modal, Image, ScrollView, PermissionsAndroid } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";
import ImageEditor from "@react-native-community/image-editor";
import BarcodeMask from 'react-native-barcode-mask';
import { useNavigation } from "@react-navigation/core";
import RadioGroup from 'react-native-radio-buttons-group';

const App = () => {
//checking git cmmmd
  const [isLoading, setisLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [textList, setTextList] = useState([]);
  const [imageUri, setimageUri] = useState('')
  const [radioButtons, setRadioButtons] = useState([])
  const [numberPlate, setNumberPlate] = useState('')

  useEffect(() => {
    imageUri && processImage()
  }, [imageUri])

  const navigation = useNavigation();

  const camRef = useRef()
  // console.log(Dimensions.get('screen').height, Dimensions.get('screen').width)

  const idGenerator = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }

  // const checkPermmissionCamera = async() => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: "MapTrak Camera Permission",
  //         message:
  //           "MapTrak App needs access to your camera " +
  //           "so you can Scan Number-Plates.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK"
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       return true;
  //     } else {
  //       return false
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }



  // @function to take picture from camera and set uri
  const takePicture = async () => {
    setisLoading(true)
    try {
      const options = {
        quality: 0.8,
        base64: true,
        fixOrientation: true,
        // height: Dimensions.get('screen').height, 
        // width : Dimensions.get('screen').width
      };
      // const cropData = {
      //   offset: {x: 600, y: 1250},
      //   size: {width: 1820, height: 1250},
      // };
      const data = await camRef.current.takePictureAsync(options);
      //const data = await camRef.current.takePictureAsync(options);
      // console.log('response', Object.keys(data));
      //console.log('response2', data.height, data.width);
      //console.log('response3', Dimensions.get('screen').height, Dimensions.get('screen').width);
      const url = await ImageEditor.cropImage(data.uri, {
        offset: { x: ((data.height * 14.8809524) / 100), y: ((data.width * 41.3359788) / 100) },
        size: { width: ((data.width * 60.1851852) / 100), height: ((data.height * 40.0019841) / 100) },
      })
      //console.log('url', url)
      setimageUri(url)
      setisLoading(false)
    } catch (e) {
      console.warn(e);
    }
  };


  // @function to detect text from image
  const processImage = async () => {
    try {
      const visionResp = await RNTextDetector.detectFromUri(imageUri);
      //console.log('visionResp', visionResp);
      visionResp.forEach((item) => {
        textList.push({ text: item.text, id: idGenerator() })
        radioButtons.push({ id: idGenerator(), label: item.text, value: item.text })
      })
      setShowModal(true)
    } catch (error) {
      console.log(error)
    }
  }

  // const cameraPermission = checkPermmissionCamera();

  // if(cameraPermission==false){
  //   return <View style={{
  //     flex:1,
  //     backgroundColor: 'white',
  //     justifyContent:'center',
  //     alignItems:'center'
  //     }}>
  //       <Text style={{alignSelf:'center'}}>Please Enable Camera Permission</Text>
  //   </View>
  // }

  const retry = () => {
    setShowModal(false)
    setTextList([])
  }

  const onPressRadioButton = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <Modal
        style={{
          alignSelf: 'center',
          height: 400,
          width: Dimensions.get('screen').width-20,
          backfaceVisibility: 'visible',
          marginHorizontal: 20,
          marginVertical: 150
        }}
        transparent={true}
        visible={showModal}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
        }}>
          <View style={{
            marginHorizontal: 40,
            marginVertical: 150,
            backgroundColor: "white",
            borderRadius: 20,
            paddingLeft: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View >
              <ScrollView >
                <View style={{paddingBottom:20,paddingTop:10}}>
                  <RadioGroup
                  selected= {false}
                    radioButtons={radioButtons}
                    onPress={onPressRadioButton}
                    containerStyle={{ alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'flex-start' }}
                  />
                </View>
              </ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 0 }}>
                {/* <Button title='confirm' onPress={() => navigation.navigate('Form')}></Button>
                <Button title='retry' onPress={() => retry()}></Button> */}
                <TouchableOpacity onPress={() => navigation.navigate('Form', { number : radioButtons.find(item => item.selected == true) })} style={{
                  padding: 10
                }}><Text style={{
                  color: 'blue',
                  fontWeight:'bold'
                }}>Confirm</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => retry()} style={{
                  padding: 10
                }}><Text style={{
                  color:'red',
                  fontWeight:'bold'
                }}>Retry</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Camera
        style={{ flexGrow: 1 }}
        ref={camRef}
        type={Camera.Constants.Type.back}
        flashMode='off'
        autoFocus={Camera.Constants.AutoFocus.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <BarcodeMask
          width={Dimensions.get('screen').width - 100}
          height={Dimensions.get('screen').width - 100}//320
          showAnimatedLine={false}
          edgeWidth={0}
          edgeHeight={0}
          edgeBorderWidth={0}
        />
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex: 1 }}>
          {
            isLoading ? <ActivityIndicator animating={isLoading} size='large' style={{ alignSelf: 'center' }} />
              : <TouchableOpacity style={{
                flex: 0,
                color: 'white',
                fontSize: 40,
                padding: 15,
                paddingHorizontal: 20,
                backgroundColor: 'blue',
                marginBottom: 50,
              }} onPress={() => takePicture()}>
                <Text>capture</Text>
              </TouchableOpacity>
          }
        </View>
      </Camera>
    </View>

  )
}

export default App

