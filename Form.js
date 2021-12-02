import { useRoute } from '@react-navigation/core'
import React, {useState} from 'react'
import { Text, TextInput, View, BackHandler } from 'react-native'

const Form = () => {

    const route = useRoute()
    const [truckNumber, setTruckNumber] = useState(route.params.number.value)


    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => BackHandler.exitApp()
      );

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Plate-Number :</Text>
            <View style={{borderRadius: 2, borderColor: 'black', backgroundColor:'grey', flex:1}}>
            <TextInput placeholder=' truck number' value={truckNumber} onChangeText={setTruckNumber} />
            </View>
        </View>
    )
}

export default Form
