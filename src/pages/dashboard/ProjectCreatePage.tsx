import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../sections/@dashboard/project/ProjectNewEditForm';

// ----------------------------------------------------------------------

export default function ProjectCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Create a new project </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new project"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Project',
              href: PATH_DASHBOARD.project.root,
            },
            { name: 'New project' },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </>
  );
}
