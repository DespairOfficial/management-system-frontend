// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    //   { title: 'ecommerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
    //   { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
    //   { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
    //   { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    //   { title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.account,
        icon: ICONS.user,
        children: [
          // { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          { title: 'list', path: PATH_DASHBOARD.user.list },
          // { title: 'create', path: PATH_DASHBOARD.user.new },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // Project
      {
        title: 'project',
        path: PATH_DASHBOARD.project.list,
        icon: ICONS.analytics,
        children: [
          { title: 'list', path: PATH_DASHBOARD.project.list },
          { title: 'create', path: PATH_DASHBOARD.project.new },
        ],
      },

      // INVOICE
      {
        title: 'invoice',
        path: PATH_DASHBOARD.invoice.root,
        icon: ICONS.invoice,
        children: [
          { title: 'list', path: PATH_DASHBOARD.invoice.list },
          { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
          { title: 'create', path: PATH_DASHBOARD.invoice.new },
          { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        ],
      },
      {
        title: 'File manager',
        path: PATH_DASHBOARD.fileManager,
        icon: ICONS.folder,
      },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'app',
    items: [
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
      {
        title: 'calendar',
        path: PATH_DASHBOARD.calendar,
        icon: ICONS.calendar,
      },
      {
        title: 'kanban',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
    ],
  },
];

export default navConfig;
