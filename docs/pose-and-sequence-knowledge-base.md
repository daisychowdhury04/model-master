# Pose & sequence knowledge base

This document defines how **poses** and **sequences** work in this repo so **humans, AI assistants, and tools** can change the right files and predict the effect.

---

## 1. Words: pose vs sequence

| Term | Meaning |
|------|--------|
| **Pose** | One named animation clip. It lists **bones** and, for each frame of the clip, **target rotations** (in **degrees**) for those bones. Stored in `components/animations/poses/`. |
| **Sequence** | An **ordered list of pose names** (strings). Playback runs pose 1, then pose 2, … The avatar keeps the end pose of each step as the start of the next (unless you reset elsewhere). Stored under `components/animations/sequences/`. |
| **Sign word key** | A key in `signSequences` (e.g. letter `"c"` or a test name). Its value is `string[]` — the sequence. |

**Rule of thumb:**  
- **New hand shape or orientation** → add or edit a **pose** (or reuse an existing pose name).  
- **“Do A, then B, then C”** → define a **sequence** of existing pose names.  
- **“At the same time, palm like X and fingers like Y”** → either one **combined pose** in `Data/hand/extra.ts` (palm + fingers in one `getRotation`), **or** one sequence step that uses **`"POSE_A+POSE_B"`** (see §6).

---

## 2. Coordinates: what the numbers are

- Rotations are **Euler angles in degrees** (not radians in data files).
- Each bone has **local** rotation **`x`**, **`y`**, **`z`** (Three.js / glTF bone space). They are **not** world-space; they are **bone-local**, so “which axis turns what” depends on the rig. When tuning, change **one axis a little at a time** and watch the viewer.
- **`getRotation(progress)`** receives `progress` from **0 → 1** over the pose duration. In most of our poses, targets are written as **`someValue * progress`** so the **target at time `t`** scales with `t`. The player then blends from **start** toward that target (see code in `handAnimations.ts`). **Do not mix radians into these numbers** — always **degrees** in the pose definitions.

**Practical effect (rough guide, verify on model):**

| Axis | Typical use (may vary by bone) |
|------|--------------------------------|
| **x** | Pitch-like tilt of the segment |
| **y** | Yaw-like turn |
| **z** | Roll-like twist |

**Palm-only poses** (`palmPoses.ts`) often animate **`RightHand`** only. **Finger poses** animate **`RightThumb1` … `RightPinky1`** (first knuckle / MCP-style control bones). **Arm moves** use **`RightShoulder`**, **`RightArm`**, **`RightForeArm`**. **Extra** (`extra.ts`) can combine **`RightHand`** with finger bones in **one** pose.

---

## 3. Where poses live (file map)

| Location | Role |
|----------|------|
| `poses/Data/basic/neutralPoses.ts` | Neutral / rest-style poses (e.g. arm neutral). |
| `poses/Data/hand/palmPoses.ts` | Palm orientation only (`RightHand`). |
| `poses/Data/hand/fingerPoses.ts` | Finger shapes (thumb + index … pinky MCP bones). |
| `poses/Data/hand/handMovements.ts` | Arm paths (shoulder / arm / forearm). |
| `poses/Data/hand/extra.ts` | **Composite** shapes: palm + fingers in **one** named pose. |
| `poses/index.ts` | Merges all pose maps, builds **left-hand** copies, **aliases** (e.g. `PALM_NORTH` → `PALM_NORTH_FACING`). |

**Naming:**

- Keys starting with **`RIGHT_`** get an automatic **`LEFT_`** mirror (see `boneMappings.ts` + `createMirroredRotation`).
- Palm/finger keys without `RIGHT_` still get **`LEFT_` + key** copies for left hand in `poses/index.ts`.

---

## 4. How to add a new pose

1. Choose the **smallest** set of bones (finger-only vs palm-only vs arm vs **extra**).
2. Add an entry to the right file (or `extra.ts` if palm + fingers together).
3. Use **`createPose(durationMs, [boneNames...], (progress) => ({ x: {...}, y: {...}, z: {...} }))`**.
4. Export the object if it’s a new file; ensure it’s merged in **`poses/index.ts`** (`poseDefinitions` / `...extraHandPoses`).
5. Optional: add an **alias** in `poses/index.ts` if you want a short name.
6. **UI groups:** `poseGroups.ts` lists which group lists which keys — add your key to **`poseGroups`** if it should appear in Train/Poses accordions.

**Duration:** `duration` is milliseconds for that single pose clip.

---

## 5. How to add or change a sequence

1. Open the letter (or test) file, e.g. `sequences/Data/C/index.ts`.
2. Export an object like `{ c: ["POSE1", "POSE2"] }` (keys are often **lowercase** words for demo typing).
3. Ensure the string **`"POSE1"`** exists as a key in the merged **`poses`** object (or is an alias).
4. Re-export is already wired via `sequences/Data/index.ts` → merged into **`signSequences`** in `sequences/index.ts`.

**Lookup:** `getSignSequence(word)` matches `word`, `word.toLowerCase()`, and `word.toUpperCase()` against `signSequences` keys.

---

## 6. Combining two poses in one step (same time)

In **`playSignWord`** (see `handAnimations.ts`), a **single** string can contain **`+`**:

```text
"PALM_NORTH_FACING+THUMB_OPEN_OTHERS_CLOSE"
```

That **splits** into two pose names, loads both configs, and applies **both** in the **same** animation frame loop (blended together for that step). Use this when two **single** poses should apply **together** without authoring a new `extra` pose.

---

## 7. Prompt template (for AI or humans)

When you describe work for this codebase, **copy and fill**:

```text
Goal: [new pose / new sequence / change existing pose]
- Target files: [e.g. poses/Data/hand/extra.ts, sequences/Data/C/index.ts]
- Bones to affect: [e.g. RightHand + RightThumb1…RightPinky1]
- Rotation intent: [e.g. “palm 90° more toward camera” → adjust RightHand y/z/x in small steps]
- Sequence name: [e.g. key "c" in C/index.ts]
- Must preserve: [left-hand mirror, existing aliases, …]
```

**For AI:** Always read **`boneName.ts`** (or `boneNames` imports) for **exact** string IDs for bones.  
**For sequence-only work:** **Do not** invent new pose names — only use names that exist in **`poses`** or `poseAliases`.

---

## 8. Quick checklist before committing

- [ ] Pose names are **UPPER_SNAKE_CASE** unless you intentionally match a lowercase `signSequences` key.
- [ ] New pose is merged in **`poses/index.ts`**.
- [ ] **Left** variants exist if you need **LEFT_** mirror (see rules in §3).
- [ ] Sequence keys match how the app looks them up (**`c`** vs **`C`** — both are tried if you use `getSignSequence`).
- [ ] Test in **Train**, **Demo**, or **Poses** page after numeric changes.

---

## 9. Related code references

- `components/animations/types.ts` — `AnimationConfig`
- `components/animations/handAnimations.ts` — `playIndividualPose`, `playSignWord`
- `components/animations/poses/index.ts` — merge + aliases + left copies
- `components/animations/sequences/index.ts` — `signSequences`, `getSignSequence`

---

*This file is the single “source of truth” for authoring rules; update it when behavior or file layout changes.*
