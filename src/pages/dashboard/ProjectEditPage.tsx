import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProjects } from '../../redux/slices/project';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import ProjectNewEditForm from '../../sections/@dashboard/project/ProjectNewEditForm';
// sections

// ----------------------------------------------------------------------

export default function ProjectEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { name } = useParams();

  const currentProject = useSelector((state) =>
    state.project.projects.find((project) => paramCase(project.name) === name)
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Edit project</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit product"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.project.root,
            },
            { name: currentProject?.name },
          ]}
        />

        <ProjectNewEditForm isEdit currentProject={currentProject} />
      </Container>
    </>
  );
}
