import * as React from "react";
import { StyleSheet, Text, TouchableOpacity} from "react-native";

interface Props
{
    label: 'LOGIN';
    onPress: () => void;
}
class Button extends React.Component
{
    render()
    {
        const { label, onPress } = this.props;
        return (
            <TouchableOpacity
            style={styles.container}
            onPress={onPress}>
                <Text style={styles.text}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
   container: {
       width: "100%",
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: 'rgb(147,112,219)',
       marginBottom: 12,
       paddingVertical: 12,
       borderRadius: 4,
       borderWidth: StyleSheet.hairlineWidth,
       borderColor: 'rgb(147,112,226)'
   },
    text: {
       color: '#fff',
        textAlign: 'center',
        height: 20
    }
});

export default Button;