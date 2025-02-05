import { expect, test } from "../../playwright-axe";
import type { SelectionOption } from "../OnyxRadioButton/types";
import OnyxRadioButtonGroup from "./OnyxRadioButtonGroup.vue";

const EXAMPLE_OPTIONS: SelectionOption<string>[] = [
  { label: "dummy.1", value: "1", id: "1" },
  { label: "dummy.2", value: "2", id: "2" },
  { label: "dummy.3", value: "3", id: "3" },
  { label: "dummy.4", value: "4", id: "4", disabled: true },
];

test("should display correctly", async ({ mount, makeAxeBuilder, page }) => {
  // ARRANGE
  const component = await mount(
    <OnyxRadioButtonGroup options={EXAMPLE_OPTIONS} headline="radio group label" />,
  );

  // ASSERT
  await expect(page.getByRole("group", { name: "radio group label" })).toBeAttached();
  await expect(page.getByText("radio group label")).toBeAttached();
  expect(await page.getByRole("radio").all()).toHaveLength(4);
  await expect(page.getByRole("radio", { name: EXAMPLE_OPTIONS[3].label })).toBeDisabled();
  await expect(component).toHaveScreenshot("default.png");

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("should display correctly when horizontal", async ({ mount }) => {
  // ARRANGE
  const component = await mount(
    <OnyxRadioButtonGroup
      options={EXAMPLE_OPTIONS}
      headline="radio group label"
      direction="horizontal"
    />,
  );

  // ASSERT
  await expect(component).toHaveScreenshot("horizontal.png");
});

test("should display correctly when disabled", async ({ mount, makeAxeBuilder, page }) => {
  // ARRANGE
  const component = await mount(
    <OnyxRadioButtonGroup options={EXAMPLE_OPTIONS} headline="radio group label" disabled />,
  );

  // ASSERT
  expect(await page.getByRole("radio", { disabled: true }).all()).toHaveLength(4);
  await expect(component).toHaveScreenshot("disabled.png");
  const accessibilityScanResults = await makeAxeBuilder().analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test("should display correctly when preselected", async ({ mount, makeAxeBuilder, page }) => {
  const updates: SelectionOption<unknown>[] = [];

  // ARRANGE
  await mount(
    <OnyxRadioButtonGroup
      options={EXAMPLE_OPTIONS}
      headline="radio group label"
      modelValue={EXAMPLE_OPTIONS[0]}
      onUpdate:modelValue={(u) => updates.push(u)}
    />,
  );

  // ASSERT
  await expect(page.getByRole("radio", { name: EXAMPLE_OPTIONS[0].label })).toBeChecked();

  // ACT
  await page.getByRole("radio", { name: EXAMPLE_OPTIONS[1].label }).click();

  // ASSERT
  await expect(page.getByRole("radio", { name: EXAMPLE_OPTIONS[1].label })).toBeChecked();
  expect(updates).toEqual([EXAMPLE_OPTIONS[1]]);

  // ACT
  const accessibilityScanResults = await makeAxeBuilder().analyze();

  // ASSERT
  expect(accessibilityScanResults.violations).toEqual([]);
});
