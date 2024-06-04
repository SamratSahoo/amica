import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { Foundation, MaterialIcons } from '@expo/vector-icons';
import { auth } from './firebase';

export const FOOTER_TABS = [{
    label: 'record', logoClass: Foundation, logoName: 'record',
    url: "/record",
    callback() {
        router.push('/record')
    }
}, {
    label: 'todo list', logoClass: Entypo, logoName: 'list',
    url: "/list",
    callback() {
        router.push('/list')
    }
}, {
    label: 'calendar', logoClass: AntDesign, logoName: 'calendar',
    url: "/calendar",
    callback() {
        router.push('/calendar')
    }
},
{
    label: 'logout', logoClass: MaterialIcons, logoName: 'logout',
    url: "/sign-in",
    callback() {
        auth.signOut().then().catch()
        router.push('/sign-in')
    }
},
    ,]