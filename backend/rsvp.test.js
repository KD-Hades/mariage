import assert from "node:assert/strict";
import test from "node:test";
import { normalizeRsvp } from "./rsvp.js";

test("normalizes an attending guest response", () => {
  assert.deepEqual(
    normalizeRsvp({
      name: "  Alex Martin  ",
      attendance: "Présent(e)",
      guests: "2",
      diet: "  Sans gluten  ",
      message: "  À bientôt  "
    }),
    {
      name: "Alex Martin",
      attendance: "Présent(e)",
      guests: 2,
      diet: "Sans gluten",
      message: "À bientôt"
    }
  );
});

test("forces absent guests to zero and clears dietary notes", () => {
  assert.deepEqual(
    normalizeRsvp({ name: "Sam", attendance: "Absent(e)", guests: "2", diet: "Allergie" }),
    {
      name: "Sam",
      attendance: "Absent(e)",
      guests: 0,
      diet: "",
      message: ""
    }
  );
});

test("rejects invalid attendance and guest counts", () => {
  assert.throws(
    () => normalizeRsvp({ name: "Sam", attendance: "Peut-être", guests: "1" }),
    /présence valide/
  );
  assert.throws(
    () => normalizeRsvp({ name: "Sam", attendance: "Présent(e)", guests: "3" }),
    /doit être 1 ou 2/
  );
});

test("rejects missing names and oversized text", () => {
  assert.throws(
    () => normalizeRsvp({ name: "  ", attendance: "Absent(e)" }),
    /nom/
  );
  assert.throws(
    () => normalizeRsvp({ name: "Sam", attendance: "Absent(e)", message: "x".repeat(2001) }),
    /longueur autorisée/
  );
});