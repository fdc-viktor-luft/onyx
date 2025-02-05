import { createScreenshotsForAllStates } from "../../utils/playwright";
import { expect, test } from "../../playwright-axe";
import OnyxButton from "./OnyxButton.vue";
import happyIcon from "@sit-onyx/icons/emoji-happy-2.svg?raw";

test("should render", async ({ mount, makeAxeBuilder }) => {
  // ARRANGE
  const component = await mount(<OnyxButton label="Button" variation="secondary" />);

  // ASSERT
  await expect(component).toContainText("Button");

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("should display correctly when disabled", async ({ mount, makeAxeBuilder }) => {
  // ARRANGE
  const component = await mount(<OnyxButton label="Button" variation="secondary" disabled />);

  // ASSERT
  await expect(component).toContainText("Button");
  await expect(component).toBeDisabled();

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("should render button with icon", async ({ mount, makeAxeBuilder }) => {
  // ARRANGE
  const component = await mount(
    <OnyxButton label="Button" variation="secondary" icon={happyIcon} />,
  );

  // ASSERT
  await expect(component).toContainText("Button");

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
});

const STATES = {
  state: ["default", "disabled", "icon"],
  variation: ["primary", "secondary", "danger"],
  mode: ["default", "outline", "plain"],
  focusState: ["", "hover", "focus-visible"],
} as const;

test(
  "State screenshot testing",
  createScreenshotsForAllStates(
    STATES,
    "button",
    async ({ variation, state, mode, focusState }, mount, page) => {
      const component = await mount(
        <OnyxButton
          label="label"
          variation={variation}
          mode={mode}
          disabled={state === "disabled"}
          icon={state === "icon" ? happyIcon : undefined}
        />,
      );

      const button = component.getByRole("button");
      if (focusState === "focus-visible") await page.keyboard.press("Tab");
      if (focusState === "hover") await button.hover();
      return component;
    },
  ),
);
