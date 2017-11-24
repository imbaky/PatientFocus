# Patient Focus

**This repository is an example project that gives guidance on setting up your Ionic application for unit testing and end-to-end (E2E) testing.** We have been told the folks at Ionic will be adding testing features to new projects in the future. But until then, feel free to borrow from this project as needed.

Special thanks to all of the contributors. With the exception of the Ionic team's updates to the framework, this project is stable. If you have a suggestion, feel free to update code and make a pull request. Find a problem or bug, feel free to file a detailed issue. 

## How to Configure Your Ionic Application for Testing

Read [this tutorial](https://leifwells.github.io/2017/08/27/testing-in-ionic-configure-existing-projects-for-testing/) for instructions on how to apply the testing configuration in this project to your own project. 

## Mocking Classes for Ionic
When a developer unit tests a component, the objective is to isolate that component as much as possible. In the case of an Ionic page, you may have Ionic components like `NavController`, `LoadingContoller`, or `Platform`. Adding these components means adding pieces of the Ionic framework to your test, thus not isolating the component. As part of this example, the file `test-config/mocks-ionic.ts` is provided for creating simple mocks for many of the classes in Ionic that you may need. You may use the classes from this file in test files inside the `TestBed.configureComponent()` method argument's `provider` array as seen in our [example unit test file](https://github.com/ionic-team/ionic-unit-testing-example/blob/master/src/app/app.component.spec.ts).

There are other mocking options that should be mentioned:
**[ionic-mocks](https://github.com/stonelasley/ionic-mocks)**
**[ionic-test-doubles](https://github.com/DomesticApp/ionic-test-doubles)**

Also worth mentioning is [ionic-native-mocks](https://github.com/chrisgriffith/ionic-native-mocks) which can be helpful when mocks for Ionic Native classes used in your project are needed.

Getting Started with this Project
-----------

To get started, clone this repo, and run `npm install` in the root directory.

```sh
npm install
npm start
```
Then, you should run `ionic serve` to make sure the project loads.

### Unit Tests

To run the tests, run `npm run test`.

See the example test in `src/app/app.component.spec.ts` for an example of a component test.

### End-To-End Tests (Browser-Only)

To serve the app, run `ionic serve`.

To run the end-to-end tests, run (while the app is being served) `npm run e2e`.

See the example end-to-end test in `e2e/app.e2e-spec.ts`.
