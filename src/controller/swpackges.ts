import { SWPackages } from '../models/swpackges'


const findAllSWPackages = async (req, res) => {
    SWPackages.find({}).then(result => res.send(result.map(SWPackages.format)))
}

const addNewSWPackage = async (req, res) => {

    try {
        const swPackge = new SWPackages({
            swPackage_name: req.body.swPackage_name,
            swPackage_version: req.body.swPackage_version,
            filename: req.file.filename, 
        })

        await swPackge.save()
        res.status(201).send(await SWPackages.format(swPackge))
    } catch (err) {
        res.status(400).send({ error: err })
    }

}

export {
    findAllSWPackages,
    addNewSWPackage
}