# [0.5.0](https://github.com/greenhub-labs/backend/compare/v0.4.0...v0.5.0) (2025-07-29)


### Bug Fixes

* Correct import path for CropVarietyEntity in get-crop-variety-by-scientific-name query handler test ([3c0c638](https://github.com/greenhub-labs/backend/commit/3c0c63880ff51d48b222912b855a27e0df716aab))
* Disable event emission for crop and crop variety updates and deletions ([bf4be25](https://github.com/greenhub-labs/backend/commit/bf4be252a4a9ec72d84b7ab3a587fee11aa199f3))
* Update crop and crop variety entities to include additional fields and improve test assertions ([dea2aea](https://github.com/greenhub-labs/backend/commit/dea2aea12d40ff40f3356cf10302153bc5c2cd92))
* Update test assertion for deleted crop date comparison ([8e4d767](https://github.com/greenhub-labs/backend/commit/8e4d76769e8d1e002a47aa65458a477f4e752de5))


### Features

* Add crop variety field to CropResponseDto and update mappers ([97f0345](https://github.com/greenhub-labs/backend/commit/97f03454d3888a2331c9396a9daea446f5f5ff68))
* Add crop variety queries and enhance crop entity handling ([37cdcbd](https://github.com/greenhub-labs/backend/commit/37cdcbd8f3cbc0ddbce2501238812e14a0636412))
* Add query to retrieve crop variety by scientific name ([9944c35](https://github.com/greenhub-labs/backend/commit/9944c35b9d285ebae283b10ec7d11e2080a83e61))
* Enhance crop management by adding crop varieties and related GraphQL schema ([0501b3f](https://github.com/greenhub-labs/backend/commit/0501b3fb44d20892c2d6da1d1a28eb8f78debc96))
* Enhance plot and crop integration in GraphQL schema ([fc72310](https://github.com/greenhub-labs/backend/commit/fc723102f4ca9bfee57783377ae71326bafb0c1c))
* Update plot and crop mapping to include crop variety details ([5d314af](https://github.com/greenhub-labs/backend/commit/5d314af8199be1ca8d4ccddd14bea846dd643067))

# [0.4.0](https://github.com/greenhub-labs/backend/compare/v0.3.0...v0.4.0) (2025-07-20)


### Features

* **release:** Enhance semantic-release workflow to capture new version ([dee7b0e](https://github.com/greenhub-labs/backend/commit/dee7b0ec67e331bb7f1180621ea96c1baf0f981b))

# [0.3.0](https://github.com/greenhub-labs/backend/compare/v0.2.4...v0.3.0) (2025-07-20)


### Features

* Add functionality to assign plots to farms and update related data structures ([d3c3fb7](https://github.com/greenhub-labs/backend/commit/d3c3fb7cea65f59d1b8943f06361c650f1998162))
* Add Plot module with dimensions, measurement units, and CRUD operations in GraphQL schema for enhanced plot management ([8d81f95](https://github.com/greenhub-labs/backend/commit/8d81f95533d0bc6602da6dcf05a9959de8d82c2c))
* Add query to retrieve plots by farm ID ([372b6de](https://github.com/greenhub-labs/backend/commit/372b6defe2638c41e4b3409b26908ecaac29dd06))
* Enhance plot dimensions management by adding specific unit measurements and conversion methods, along with updates to GraphQL schema and DTOs for improved clarity and functionality ([56d9b2f](https://github.com/greenhub-labs/backend/commit/56d9b2f42f85824e51061a9fb3c1a5f666a9bf6e))
* Introduce SoilType enum and update plot-related structures ([9adbf2a](https://github.com/greenhub-labs/backend/commit/9adbf2a375ace77658443c4ff612767bb761a8ca))
* Update farm retrieval methods to exclude soft-deleted farms ([8700167](https://github.com/greenhub-labs/backend/commit/87001676e78a3e87cb553ed42f04c5bb22823846))
* Update getPlotsByFarmId query to use input DTO ([5818d3c](https://github.com/greenhub-labs/backend/commit/5818d3ce7afe24736946e704b274aa923b5207f2))
* Update plot retrieval methods to exclude soft-deleted plots ([6a23b92](https://github.com/greenhub-labs/backend/commit/6a23b9221c783dc51705430877d0c6e62a74bc60))
* Update user retrieval method to exclude soft-deleted users ([98a1987](https://github.com/greenhub-labs/backend/commit/98a1987811bda6916b7fe5f2267ac3512b8a0256))

## [0.2.4](https://github.com/greenhub-labs/backend/compare/v0.2.3...v0.2.4) (2025-07-18)


### Bug Fixes

* Add branch for automated versioning and Docker image publishing in GitHub Actions workflow ([e81d9c3](https://github.com/greenhub-labs/backend/commit/e81d9c391a4de77e478b212fd2c9a206ef4e9194))
* Enhance GitHub Actions workflow for Docker and pnpm ([5e38ffe](https://github.com/greenhub-labs/backend/commit/5e38ffe687099b284661d74bb98a52373257d8ba))
* Remove unused branch and Docker Scout step from GitHub Actions workflow ([7f20b51](https://github.com/greenhub-labs/backend/commit/7f20b5192d1b0e42ef36f7e893a8c5a0664711fe))

## [0.2.3](https://github.com/greenhub-labs/backend/compare/v0.2.2...v0.2.3) (2025-07-18)


### Bug Fixes

* Update pnpm install command to use --frozen-lockfile ([a8613f5](https://github.com/greenhub-labs/backend/commit/a8613f563b0174a6465296c3e61b9d00083824e0))

## [0.2.2](https://github.com/greenhub-labs/backend/compare/v0.2.1...v0.2.2) (2025-07-18)


### Bug Fixes

* update pnpm-lock.yaml to match package.json dependencies ([983c420](https://github.com/greenhub-labs/backend/commit/983c420bc1a855d1ebd5c1c1056a7ed401b04377))

## [0.2.1](https://github.com/greenhub-labs/backend/compare/v0.2.0...v0.2.1) (2025-07-18)


### Bug Fixes

* Update version to 0.2.1 and remove @semantic-release/npm plugin ([3557a03](https://github.com/greenhub-labs/backend/commit/3557a03f7102c085bbfc10a80671f37d30df7f07))

# [0.2.0](https://github.com/greenhub-labs/backend/compare/v0.1.1...v0.2.0) (2025-07-18)


### Features

* Add @semantic-release/npm plugin and update configuration ([e5dedda](https://github.com/greenhub-labs/backend/commit/e5dedda6a5058ce6b45f1e61f36983351431c5d4))

## [0.1.1](https://github.com/greenhub-labs/backend/compare/v0.1.0...v0.1.1) (2025-07-18)


### Bug Fixes

* Update Docker image name in GitHub Actions workflow to use repository name dynamically ([ee37a9d](https://github.com/greenhub-labs/backend/commit/ee37a9d15018ee6f273a3c13ead4e84bb591c520))

# [0.1.0](https://github.com/greenhub-labs/backend/compare/v0.0.1...v0.1.0) (2025-07-18)


### Features

* Add GitHub Actions workflow for release and Docker image publishing to GHCR ([7116ac9](https://github.com/greenhub-labs/backend/commit/7116ac99344539e8202dcae710fc8f784907e65d))
* Enhance GitHub Actions workflow by adding permissions, configuring Git, and setting fetch depth for improved release process ([0ccadef](https://github.com/greenhub-labs/backend/commit/0ccadefe60aa34268d490d6418dde024cab64a87))
* Update dependencies for semantic-release and add pnpm support in GitHub Actions workflow ([09a047a](https://github.com/greenhub-labs/backend/commit/09a047aaec5be397f05f0822020b5d0ad552d32e))
