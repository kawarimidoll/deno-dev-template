# deno-dev-template

my deno template

## Logger

import from `logger.ts`.

```ts
import { Logger } from "./logger.ts";

Logger.debug("This log is debug!");
Logger.info("This log is info!");
Logger.warning("This log is warning!");
Logger.error("This log is error!");
```

## CI

run `ci.sh`.

```
$ sh ci.sh
+ deno fmt
Checked 6 files
+ deno lint
Checked 4 files
```
