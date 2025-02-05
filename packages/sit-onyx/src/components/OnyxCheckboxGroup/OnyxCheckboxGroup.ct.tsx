import { expect, test } from "../../playwright-axe";
import OnyxCheckboxGroup from "./OnyxCheckboxGroup.vue";
import type { OnyxCheckboxGroupProps } from "./types";

const mockOptions: OnyxCheckboxGroupProps["options"] = [
  { label: "Default", id: "id-1" },
  { label: "Required", id: "id-2", required: true },
  { label: "Disabled", id: "id-3", disabled: true },
];

test("should render", async ({ page, mount, makeAxeBuilder }) => {
  let modelValue: string[] = [];

  const eventHandlers = {
    "update:modelValue": (newValue: string[]) => (modelValue = newValue),
  };

  // ARRANGE
  const component = await mount(OnyxCheckboxGroup, {
    props: {
      options: mockOptions,
      headline: "Checkbox group headline",
      withCheckAll: true,
    } satisfies OnyxCheckboxGroupProps,
    on: eventHandlers,
  });

  const masterCheckBox = component.getByLabel("Select all");

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
  await expect(masterCheckBox).not.toBeChecked();
  await expect(masterCheckBox).toHaveJSProperty("indeterminate", false);
  await expect(component).toHaveScreenshot("default.png");

  // ACT
  await component.getByLabel("Default").check();
  expect(modelValue).toStrictEqual(["id-1"]);
  await component.update({ props: { modelValue }, on: eventHandlers });
  await page.mouse.move(0, 0); // needed to remove hover effect that Playwright adds from checking

  // ASSERT
  await expect(masterCheckBox).not.toBeChecked();
  await expect(masterCheckBox).toHaveJSProperty("indeterminate", true);
  await expect(component).toHaveScreenshot("indeterminate.png");

  // ACT
  await masterCheckBox.check();
  expect(modelValue).toStrictEqual(["id-1", "id-2"]);
  await component.update({ props: { modelValue }, on: eventHandlers });
  await page.mouse.move(0, 0); // needed to remove hover effect that Playwright adds from checking

  // ASSERT
  await expect(masterCheckBox).toBeChecked();
  await expect(masterCheckBox).toHaveJSProperty("indeterminate", false);
  await expect(component.getByLabel("Default")).toBeChecked();
  await expect(component.getByLabel("Required")).toBeChecked();
  await expect(component.getByLabel("Disabled")).not.toBeChecked();

  await expect(component).toHaveScreenshot("checked.png");

  // ACT
  await masterCheckBox.uncheck();
  expect(modelValue).toStrictEqual([]);
  await component.update({ props: { modelValue }, on: eventHandlers });
  await page.mouse.move(0, 0); // needed to remove hover effect that Playwright adds from unchecking

  // ASSERT
  await expect(masterCheckBox).not.toBeChecked();
  await expect(masterCheckBox).toHaveJSProperty("indeterminate", false);
  await expect(component.getByLabel("Default")).not.toBeChecked();
  await expect(component.getByLabel("Required")).not.toBeChecked();
  await expect(component.getByLabel("Disabled")).not.toBeChecked();
});

test("should render horizontally", async ({ mount, makeAxeBuilder }) => {
  // ARRANGE
  const component = await mount(
    <OnyxCheckboxGroup
      options={mockOptions}
      headline="Horizontal group headline"
      direction="horizontal"
    />,
  );

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
  await expect(component).toHaveScreenshot("horizontal.png");
});

test("should disabled all checkboxes if group is disabled", async ({ mount }) => {
  // ARRANGE
  const component = await mount(
    <OnyxCheckboxGroup options={mockOptions} headline="Disabled group headline" disabled />,
  );

  // ASSERT
  const checkboxes = await component.getByRole("checkbox").all();

  for (const checkbox of checkboxes) {
    await expect(checkbox).toBeDisabled();
  }
});
