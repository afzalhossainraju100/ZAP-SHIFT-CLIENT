import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-end  justify-center gap-3 mb-4">
      <img src={logo} alt="logo" />
      <h2 className="text-2xl md:text-3xl  -ms-6 font-bold tracking-wider">
        ZapShift
      </h2>
    </div>
  );
};

export default Logo;
