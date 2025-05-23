import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();


export const createNewStorageUnit = async(req:Request, res:Response)=>{

    try {
        const {name,size,location,pricePerDay,isAvailable=true}= req.body;

        const unit = await prisma.storageUnit.create({
            data: {
                name,
                size,
                location,
                pricePerDay: parseFloat(pricePerDay.toString()),
                isAvailable
            }

        })
   
     res.status(201).json(unit);
    return 
   
    } catch (error) {
        console.error("Error creating storage unit:", error);
        res.status(500).json({ error: "Internal server error" });
        
    }

}

export const getAllUnits = async(req: Request, res: Response) => {
  try {
    const { location, size, available } = req.query;
    
    const where: any = {};
    
    if (location && location !== 'all') {
      where.location = location;
    }
    
    if (size && size !== 'all') {
      where.size = size;
    }
    

    if (available !== undefined) {
      where.isAvailable = available === 'true';
    }
    
    const units = await prisma.storageUnit.findMany({
      where,
      orderBy: [
        { isAvailable: 'desc' },
        { pricePerDay: 'asc' }
      ],
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });


    const allUnits = await prisma.storageUnit.findMany({
      select: {
        location: true,
        size: true
      }
    });

    const locations = [...new Set(allUnits.map(unit => unit.location))].sort();
    const sizes = [...new Set(allUnits.map(unit => unit.size))].sort();

    res.json({
      units,
      filters: {
        locations,
        sizes
      },
      total: units.length
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getSingleUnit = async(req:Request, res:Response)=>{
     try {
    const { id } = req.params;
    
    const unit = await prisma.storageUnit.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            startDate: true,
            endDate: true,
            userName: true
          },
          orderBy: {
            startDate: 'asc'
          }
        }
      }
    });

    if (!unit) {
      res.status(404).json({ error: 'Storage unit not found' });
       
    }

    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
     
      
    res.status(500).json({ error: "Internal server error" });
  }
};
