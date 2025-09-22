{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20,
    pkgs.terraform, # Added Terraform for Infrastructure as Code
    pkgs.lighthouse # Added Lighthouse for performance auditing
  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}