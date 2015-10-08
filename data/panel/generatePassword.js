"use strict";

onInit(function()
{
  self.port.on("passwordAdded", () => setActivePanel("password-list"));
  self.port.on("passwordAlreadyExists", () => validateElement("generate-password-name", messages["password-name-exists"]));

  setSubmitHandler("generate-password", addGeneratedPassword);
  setResetHandler("generate-password", () => setActivePanel("password-list"));

  $("password-length").addEventListener("input", updatePasswordLengthDisplay);
  $("generate-password").addEventListener("reset", () => {
    setTimeout(updatePasswordLengthDisplay, 0);
  });
  updatePasswordLengthDisplay();

  setValidator("generate-password-name", enforceValue.bind(null, "password-name-required"));
  setValidator(["charset-lower", "charset-upper", "charset-number", "charset-symbol"], validateCharsets);
});

onShow(function({site})
{
  $("generate-password-site").textContent = site;
});

function updatePasswordLengthDisplay()
{
  $("password-length-value").textContent = $("password-length").value;
}

function validateCharsets(element1, element2, element3, element4)
{
  if (!element1.checked && !element2.checked && !element3.checked && !element4.checked)
    return messages["no-characters-selected"];

  return null;
}

function addGeneratedPassword()
{
  self.port.emit("addGeneratedPassword", {
    site: $("site").value,
    name: $("generate-password-name").value,
    length: $("password-length").value,
    lower: $("charset-lower").checked,
    upper: $("charset-upper").checked,
    number: $("charset-number").checked,
    symbol: $("charset-symbol").checked
  });
}
