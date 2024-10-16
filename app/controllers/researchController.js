const Research = require("../models/research");

exports.getResearches = async (req, res, next) => {
  try {
    const researches = await Research.find();
    res.status(201).json({
      status: "success",
      researches,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getResearch = async (req, res, next) => {
//   console.log("req.params.id ", req.params.id);

//   try {
//     const research = Research.findOne({ _id: req.params.id });

//     console.log("research", research);

//     res.status(201).json({
//       status: "success",
//       research,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createResearch = async (req, res, next) => {
  const { name, description, college, participants } = req.body;

  console.log("req.body", req.body);

  try {
    const createdResearch = await Research.create({
      name,
      description,
      college,
      participants,
      ...(req?.file?.path && { image: req?.file?.path }),
    });

    console.log("createdResearch", createdResearch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
