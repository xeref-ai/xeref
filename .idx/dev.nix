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
    enable = true; # Added this line
    previews = {
      web = {
        # Updated the command to work with IDX
        command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
        manager = "web";
      };
    };
  };
}