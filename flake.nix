{
  outputs = { self, nixpkgs }: let
    systems = [ "x86_64-linux" ];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });

    olomouc-dance-for = forAllSystems (system: let
      pkgs = import nixpkgs { inherit system; };
      filterSite = path: _:
      let baseName = baseNameOf (toString path); in
      baseName != "scss" &&
      baseName != "default.nix" &&
      baseName != "result" &&
      baseName != ".git" &&
      baseName != ".gitignore" &&
      baseName != ".gitmodules" &&
      baseName != ".sass-cache";
    in pkgs.stdenv.mkDerivation rec {
      name = "olomouc.dance";
      src = builtins.filterSource filterSite ./.;
      phases = "unpackPhase buildPhase";
      buildPhase = ''
        mkdir -p $out
        cp -r ./* $out
      '';
    });

  in {
    defaultPackage.x86_64-linux = olomouc-dance-for.x86_64-linux;
    packages.x86_64-linux = { olomouc-dance = olomouc-dance-for.x86_64-linux; };
  };
}
