import Vue from 'vue'
import {
    Button,
    Select,
    Form,
    FormItem,
    Input,
    Container,
    Header,
    Main,
    Aside,
    Menu,
    MenuItem,
    MenuItemGroup,
    Submenu,
    Breadcrumb,
    BreadcrumbItem,
    Table,
    TableColumn,
    Switch,
    Dialog,
    Message,
    MessageBox,
    Option,
    Pagination
} from 'element-ui';

Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Option)
Vue.use(Pagination)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox