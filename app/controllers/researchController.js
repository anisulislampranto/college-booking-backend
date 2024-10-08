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

// exports.createResearch = async (req, res, next) => {
//   const { name, description, college } = req.body;

//   try {
//     const createdResearch = await Research.create({
//       name,
//       description,
//       college,
//       ...(req?.file?.path && { image: req?.file?.path }),
//     });

//     res.json(createdResearch);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
