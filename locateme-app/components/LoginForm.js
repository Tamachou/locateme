import * as React from 'react';
import { StyleSheet, TextInput, TextInputProps } from "react-native";

class FormInput  extends React.Component{
    render() {
        const { style, ...otherProps } = this.props;
        return(
            <TextInput
            selectionColor='rgb(147,112,219)'
            style={styles.textInput}
            {...otherProps}
            keyboardType={'numeric'}
            />
        );
    }
}
const styles = StyleSheet.create({
   textInput: {
       height: 40,
       borderColor: '#C0C0C0',
       borderBottomWidth: StyleSheet.hairlineWidth,
       marginBottom: 20,
   },

});

export  default  FormInput;