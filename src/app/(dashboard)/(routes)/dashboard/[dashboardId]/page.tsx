interface IProps {
  params: {
    dashboardId: string;
  };
}

export default function Dashboard({ params }: IProps) {
  const { dashboardId } = params;

  return <div>Dashboard</div>;
}
