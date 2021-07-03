import { Avatar, Card, CardContent, Grid, Tooltip, Button } from '@material-ui/core';
import React from 'react';
import { useRouter } from 'next/router';
import { ProjectState } from 'helpers/type';
interface InitProps {
  project: ProjectState;
}

type BodyProps = InitProps;

const ProjectPageUI: React.FunctionComponent<BodyProps> = (props: InitProps) => {
  const { project }: InitProps = props;
  const char = project?.name?.charAt(0);
  const router = useRouter();
  const pathname = router.pathname;

  const onPushToPage = (url: string) => {
    void router.push(`/${url}`, `/${url}.html`);
  };

  const onPushToDetail = () => {
    void router.push({ pathname: `${pathname}/detail`, query: { id: project._id } });

  };

  return (
    <Grid item xs={12} sm={3} className='project-card'>
      <Card className='page-project-card'>
        <CardContent className='card-header'>
          <div className='link-name-project'>
            <Avatar className='icon-sentry'>{char}</Avatar>
            <div className='text-nodejs' onClick={onPushToDetail}>
                {project.name}
            </div>
          </div>
          <div className='summary-links'>
            <Tooltip title='See more error'>
              <Button className='link-project-des' onClick={() => onPushToPage('event_logs')}>
                <span className='text-des'>
                  {project.totalEventLogs} error
                </span>
              </Button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProjectPageUI;
