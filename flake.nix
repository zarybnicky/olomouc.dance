{
  outputs = { self, nixpkgs }: let
    pkgs = import nixpkgs {
      system = "x86_64-linux";
      overlays = [ self.overlay ];
    };
  in {
    overlay = final: prev: {
      olomouc-dance = let
        filterSite = path: _:
          let baseName = baseNameOf (toString path); in
          baseName != "scss" &&
          baseName != "default.nix" &&
          baseName != "result" &&
          baseName != ".git" &&
          baseName != ".gitignore" &&
          baseName != ".gitmodules" &&
          baseName != ".sass-cache";
      in final.stdenv.mkDerivation rec {
        name = "olomouc.dance";
        src = builtins.filterSource filterSite ./.;
        phases = "unpackPhase buildPhase";
        buildPhase = ''
          mkdir -p $out
          cp -r ./* $out
        '';
      };
    };
    defaultPackage.x86_64-linux = self.packages.x86_64-linux.olomouc-dance;
    packages.x86_64-linux = { inherit (pkgs) olomouc-dance; };
  };
}
