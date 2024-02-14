{
  description = "Grid Tetris";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-23.11";
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, gitignore }:
    let
      allSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs allSystems (system: f {
        inherit system;
        pkgs = import nixpkgs { inherit system; };
      });
    in {
      packages = forAllSystems ({ pkgs, ... }: rec {
        default = grid-tetris;
        grid-tetris = pkgs.buildNpmPackage {
          name = "Grid Tetris";
          src = gitignore.lib.gitignoreSource ./.;
          npmDepsHash = "sha256-wyUkLKHPIM9i/LNAlY/d9iRC/kaiZ2umHQdLZTeAJN4=";
          installPhase = ''
            mkdir -p $out/dist
            cp -r dist/ $out/
          '';
        };
      });
    };
}
