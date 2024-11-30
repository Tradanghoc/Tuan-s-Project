import { StyleSheet} from 'react-native'

export enum Colors {
    white = '#ffffff',
    black = '#000000',
    slate = '#868686',
    silver = '#E3E3E3',
    orange = '#ee4d2d',
    ember = '#BF3E00',
    green = '#22A45D',
    blue = '#4285F4',
    navy = '#395998',
    nox = '#263238',
    yellow = '#FFC529',
  }

export const screenStyles = StyleSheet.create({
    parent_container: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 15
    },
})