# Reversi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## ToDo

* [x] signal整理
* [x] 自分でめくるモード
  * [x] おいた石のハイライト
  * [x] 時間経過でめくるべき石のハイライト
  * [x] ヒント時間調整
  * [x] ヒントのオン/オフ
* [x] 四隅の黒丸
* [x] 両方が詰んだときに終了する
* [x] ヒントのオン/オフ
* [x] 決着時のメッセージ
* [x] 設定の保存
* [ ] 盤面の保存
* [ ] めくり方可変
  * [ ] ていねい
  * [ ] せっかち
* [x] どっちの手番か表示する
* [ ] CPU