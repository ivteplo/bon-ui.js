# Contributing to Bon UI

All work on Bon UI happends directly on [Github](https://github.com/teplovs/bon-ui).

## Semantic Versioning
Bon UI follows semantic versioning. We release path versions for critical bugfixed, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.

Every significant change in documented in changelog file.

## Branch Organization

Submit all changes directly to the `master` branch. We don't use separate branches for development or for upcoming releases. We do our best to keep `master` in good shape, with all tests passing.

Code that lands in `master` must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of master at any time.

## Bugs
### Where to find known issues
We aer using [Github Issues](https://github.com/teplovs/bon-ui/issues) for our public bugs. We keep a close eye on this and try to make it clean when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.

## Proposing a change
If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend filing an issue. This lets us reach an agreement on your promosal before you put significant effort into it.

If you're only fixing a bug, it's fine to  submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Your first pull request

You can learn how to make pull request from [this article](https://github.com/firstcontributions/first-contributions/blob/master/README.md).

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than two weeks, it's fine to take it over but you should still leave a comment.

## Sending a pull request

Our team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation.

__Before submitting a pull request__, please make sure the following is done:
1. Fork the repository and create your branch from `master`.
2. Run `npm install` in the repository root.
3. If you've fixed a bug or added code that should be tested, add tests!
4. You can debug tests using `npm run debug:tests`.
4. Ensure the test suite passes (`npm run test`).
5. Make sure your code lints (`npm run lint`).

## License

By contributing to Bon UI, you agree that your contributions will be licensed under its Apache-2.0 license.

