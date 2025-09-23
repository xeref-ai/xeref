{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.terraform
    pkgs.lighthouse
    pkgs.python3
    pkgs.gnumake
    pkgs.gcc
  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    previews = {
      web = {
        # Simplified the command for a more stable, standard startup
        command = ["npm", "run", "dev"];
        manager = "web";
      };
    };
  };
}