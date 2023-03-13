export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`;

    if (binding.arg === "full") {
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconClass += " float-right";
    }
    if (binding.modifiers.yellow) {
      iconClass += " text-yellow-400";
    }
    if (binding.modifiers.green) {
      iconClass += " text-green-400";
    }
    if (binding.modifiers.primary) {
      iconClass += " text-primary";
    }
    if (binding.modifiers.secondary) {
      iconClass += " text-secondary";
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
