import Logo from '../Logo';

export default function LogoExample() {
  return (
    <div className="p-8 space-y-8">
      <div className="p-8 bg-background">
        <Logo variant="dark" />
      </div>
      <div className="p-8 bg-gradient-to-br from-primary to-chart-2">
        <Logo variant="light" />
      </div>
    </div>
  );
}
