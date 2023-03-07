import AboutView from "@/views/AboutView.vue";

import { shallowMount } from "@vue/test-utils";

describe("AboutView.vue", () => {
  test("renders inner text", () => {
    const wrapper = shallowMount(AboutView, {
      global: {
        mocks: {
          $t: (message) => message,
        },
      },
    });

    console.log(wrapper.text());
    expect(wrapper.text()).toContain("about");
  });
});
