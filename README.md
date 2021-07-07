# deno-dev-template

[![ci](https://github.com/kawarimidoll/deno-dev-template/workflows/ci/badge.svg)](.github/workflows/ci.yml)
[![deno.land](https://img.shields.io/badge/deno-%5E1.0.0-green?logo=deno)](https://deno.land)
[![vr scripts](https://badges.velociraptor.run/flat.svg)](https://velociraptor.run)
[![LICENSE](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

my deno template

Confirm there is `~/.deno/bin` in `$PATH` to use the scripts installed by
`deno install`.

## Run with Velociraptor

Need to install [Velociraptor](https://velociraptor.run/).

```
$ # install velociraptor
$ deno install -qAn vr https://deno.land/x/velociraptor/cli.ts
$ # install hook
$ vr
```

The scripts are defined in [velociraptor.yml](/velociraptor.yml).

### Run main.ts

```
$ vr start
```

### Start server.ts

Need to install [deployctl](https://deno.com/deploy/docs/deployctl).

```
$ # install deployctl
$ deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts
$ # start server
$ vr dev
```

### Run tests

Need to create `.env`.

```
$ # create .env
$ cp .env.example .env
$ # run tests
$ vr test
```

### Run CI

```
$ # run lint, format, tests
$ vr ci
```

## Logger

Import from `logger.ts`.

```ts
import { Logger } from "./logger.ts";

Logger.debug("This log is debug!");
Logger.info("This log is info!");
Logger.warning("This log is warning!");
Logger.error("This log is error!");
```
